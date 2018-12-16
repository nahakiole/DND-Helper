<?php
/**
 * Created by PhpStorm.
 * User: manuelmeister
 * Date: 16.12.18
 * Time: 12:04
 */

define( 'IGNORE_FILES', [ '.', '..' ] );
define( 'DIR_ROOT', 'sounds/' );

require '../vendor/autoload.php';

try {
	$dir   = scandir( '../' . DIR_ROOT );
	$items = array_diff( $dir, IGNORE_FILES );

	$id     = 0;
	$sounds = [];

	$id3engine = new getID3();


	function convert_to_url( $path ) {
		$exploded = explode( '/', $path );
		$return   = [];
		foreach ( $exploded as $item ) {
			$return[] = rawurlencode( $item );
		}

		return join( '/', $return );
	}

	function format_duration( $seconds ) {
		$minutes = $seconds / 60;
		$result  = '';
		if ( $minutes >= 1 ) {
			$result .= $minutes;
		} else {
			$result = '0';
		}
		if ( $seconds % 60.0 > 9 ) {
			$result .= ':' . $seconds % 60.0;
		} else {
			$result .= ':0' . $seconds % 60.0;
		}

		return $result;
	}

	/**
	 * Loops through given directory
	 *
	 * @param $items
	 * @param $category
	 * @param $dir_path
	 * @param $id3engine getID3
	 * @param $id
	 * @param $sounds
	 */
	function loop_dir( $items, $category, $dir_path, $id3engine, &$id, &$sounds ) {
		foreach ( $items as $item ) {
			if ( is_dir( '../' . $dir_path . $item ) ) {
				$local_dirpath = $dir_path . $item . '/';
				$local_dir     = scandir( '../' . $local_dirpath );
				$local_items   = array_diff( $local_dir, IGNORE_FILES );
				loop_dir( $local_items, $item, $local_dirpath, $id3engine, $id, $sounds );
			} else {
				$info = $id3engine->analyze( '../' . $dir_path . $item );
				getid3_lib::CopyTagsToComments( $info );
				$sounds[] = [
					'id'       => $id ++,
					'category' => rawurldecode( $category ),
					'title'    => $info['comments']['title'][0],
					'length'   => format_duration( round( $info['playtime_seconds'], 1 ) ),
					'loop'     => strpos( $item, '_loop' ) !== false,
					'src'      => convert_to_url( $dir_path . $item )
				];
			}
		}
	}

	loop_dir( $items, 'Uncategorized', DIR_ROOT, $id3engine, $id, $sounds );

	header( 'Content-Type: application/json' );
	echo( json_encode( $sounds ) );
} catch ( Exception $e ) {
	header( 'Sorry: ' . $e->getTraceAsString(), false, 500 );
	die();
}