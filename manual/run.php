<?php

$desc
    = "1.3. Efrain
Spielleiter (Passiv)
Kung-Fu Kater (Passiv)
Nicht-Fleisch-Esser (Passiv)
Ninja Meerschweinchen Untertane

Lebenspunkte: 22
Ausdauer: 20
Borat-Anzug

Stärke 75
Athletik +2

Geschicklichkeit 55
Akrobatik -3
Schleichen +2
Fingerfertigkeit -2

Intelligenz 75
Geschichtekenntnisse +3
Religion +2
Naturkenntnisse 0
Sherlock-Skillz +3

Charisma 64
Verängstigung (Buh!) +5
Verführung +3
Täuschung -4
Auftreten +3

Weisheit 80
Einsicht -7
Umgang mit Tieren +5
Brätelskills +3
Menschenkenntnis 0
Medizin +1

Initiative 80


";

$translate = [
    'Stärke'               => 'strength',
    'Athletik'             => 'athletic',
    'Geschicklichkeit'     => 'dexterity',
    'Akrobatik'            => 'acrobatics',
    'Schleichen'           => 'stealth',
    'Fingerfertigkeit'     => 'sleightofhand',
    'Intelligenz'          => 'intelligence',
    'Geschichtekenntnisse' => 'history',
    'Religion'             => 'religion',
    'Naturkenntnisse'      => 'nature',
    'Sherlock-Skillz'      => 'investigation',
    'Charisma'             => 'charisma',
    'Verängstigung'        => 'intimidation',
    'Verführung'           => 'deception',
    'Täuschung'            => 'intimidation',
    'Auftreten'            => 'performance',
    'Weisheit'             => 'wisdom',
    'Einsicht'             => 'insight',
    'Umgang'               => 'animalhandeling',
    'Brätelskills'         => 'survival',
    'Menschenkenntnis'     => 'peopleskills',
    'Medizin'              => 'medicine',
    'Initiative'           => 'initiative'
];

preg_match(
    '/[0-9]+\.[0-9]+\.\s+(?<name>[a-zA-Z]+)
+((?<abilities>([a-zäöüÄÜÖ]|-|“|\s|\(|\))+)\n)+
Lebenspunkte: (?<lp>[0-9\.]+)
Ausdauer: (?<ap>[0-9\.]+)(?<skill>.*)/is', $desc, $matches
);
echo '<pre>';

var_dump($matches);

$skillList = explode("\n", $matches['skill']);
array_walk(
    $skillList, function (&$value, $key) {
    $value = trim($value);
}
);
$skills = [];
foreach ($skillList as $skill) {
    if (!empty($skill)) {
        $skillStr = explode(' ', $skill);
        if (!array_key_exists(
            $skillStr[0], $translate
        )
        ) {
            continue;
        }
        $skills[$translate[$skillStr[0]]] = $skillStr[count($skillStr) - 1];
    }
}
$abilities = explode("\n", $matches['abilities']);
array_walk(
    $abilities
    , function (&$value, $key) {
    $value = utf8_encode(trim($value));
}
);

$data = [
    'name'      => utf8_encode($matches['name']),
    'abilities' => $abilities,
    'lp'        => $matches['lp'],
    'ap'        => $matches['ap'],
    'skill'     => $skills,
];
file_put_contents(
    __DIR__ . '/characters/' . strtolower($matches['name']) . '.json', json_encode($data, JSON_PRETTY_PRINT, 5)
);