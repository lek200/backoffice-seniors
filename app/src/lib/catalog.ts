import type { Cours } from "./types"

// ============================================================
// Catalogue de cours intégré — livré avec l'app (le formateur
// n'a rien à installer). Fusionné avec les cours Supabase dans
// AppContext. Chaque `corps` utilise des titres EN MAJUSCULES
// séparés par des lignes vides : le lecteur (buildSlides) en fait
// une diapositive titrée. `situation` et `quiz` alimentent les
// dernières diapositives.
// ============================================================

export const CATALOG: Cours[] = [
  // ---------- Prise en main ----------
  {
    id: "cat-prise-1",
    titre: "Allumer, éteindre et verrouiller votre appareil",
    domaine: "Prise en main",
    niveau: 1,
    statut: "publie",
    corps: `POURQUOI C'EST IMPORTANT :
Savoir allumer, éteindre et verrouiller votre appareil, c'est la toute première clé. Rien ne peut casser en appuyant sur ces boutons.

ALLUMER ET RÉVEILLER :
Un appui long sur le bouton sur le côté allume l'appareil. Un appui court "réveille" l'écran quand il s'est éteint tout seul.

VERROUILLER SANS ÉTEINDRE :
Un appui court sur ce même bouton éteint juste l'écran : l'appareil se repose sans tout fermer. C'est le geste à faire quand vous posez la tablette.

À RETENIR :
Appui court = mettre en veille. Appui long = allumer ou éteindre complètement. Vous ne risquez rien à essayer.`,
    situation:
      "MISE EN SITUATION : Vous avez fini de regarder vos photos et vous posez la tablette sur la table. Quel geste faites-vous pour qu'elle se repose sans tout fermer ?",
    quiz: [
      {
        q: "Pour simplement mettre l'écran en veille, vous appuyez comment ?",
        options: ["Un appui long", "Un appui court", "Deux appuis longs"],
        bonne: 1,
        bravo: "Exactement : un appui court met en veille sans rien fermer.",
        aide: "Un appui court suffit pour éteindre l'écran et mettre en veille.",
      },
      {
        q: "Peut-on abîmer l'appareil en appuyant sur le bouton d'allumage ?",
        options: ["Oui, il faut être prudent", "Non, aucun risque"],
        bonne: 1,
        bravo: "Voilà l'état d'esprit : on essaie sans crainte.",
        aide: "Ces boutons sont prévus pour ça, il n'y a aucun risque.",
      },
    ],
  },
  {
    id: "cat-prise-2",
    titre: "Le clavier et l'écran tactile",
    domaine: "Prise en main",
    niveau: 2,
    statut: "publie",
    corps: `TOUCHER AU BON ENDROIT :
L'écran réagit au doigt. Touchez franchement, mais sans appuyer fort. Un doigt sec fonctionne mieux qu'un doigt humide.

FAIRE APPARAÎTRE LE CLAVIER :
Le clavier apparaît tout seul dès que vous touchez une zone où l'on peut écrire (une barre de recherche, un message).

CORRIGER UNE ERREUR :
La touche avec la flèche (retour arrière) efface la dernière lettre. Rien n'est jamais définitif tant que vous n'avez pas envoyé.

LES MAJUSCULES ET LES CHIFFRES :
La flèche vers le haut met une majuscule. La touche "123" fait apparaître les chiffres.`,
    situation:
      "MISE EN SITUATION : Vous tapez le nom d'une ville dans la barre de recherche et vous vous trompez d'une lettre. Quelle touche utilisez-vous pour corriger ?",
    quiz: [
      {
        q: "Comment fait-on apparaître le clavier ?",
        options: [
          "Il faut le chercher dans les réglages",
          "Il apparaît quand on touche une zone où écrire",
          "Il est toujours affiché",
        ],
        bonne: 1,
        bravo: "C'est ça : le clavier arrive tout seul au bon moment.",
        aide: "Le clavier s'affiche dès qu'on touche une zone de saisie.",
      },
    ],
  },
  {
    id: "cat-prise-3",
    titre: "Régler le son et la taille du texte",
    domaine: "Prise en main",
    niveau: 3,
    statut: "publie",
    corps: `LE VOLUME :
Les deux boutons sur la tranche montent et baissent le son. Le haut pour plus fort, le bas pour moins fort.

GROSSIR LE TEXTE :
Dans les Réglages, la rubrique "Affichage" permet d'agrandir toutes les lettres. Votre confort passe avant tout.

LA LUMINOSITÉ :
Toujours dans les Réglages, vous pouvez éclaircir ou assombrir l'écran selon la pièce où vous êtes.

À RETENIR :
Un appareil bien réglé fatigue moins les yeux et les oreilles. Ces réglages se changent autant de fois qu'on veut.`,
    situation:
      "MISE EN SITUATION : Le texte est trop petit et vous fatiguez les yeux. Dans quelle rubrique des Réglages allez-vous pour l'agrandir ?",
    quiz: [
      {
        q: "Où agrandit-on la taille du texte ?",
        options: ["Dans les Réglages, rubrique Affichage", "En secouant l'appareil", "On ne peut pas"],
        bonne: 0,
        bravo: "Parfait, l'Affichage règle la taille des lettres.",
        aide: "C'est dans les Réglages, à la rubrique Affichage.",
      },
    ],
  },

  // ---------- Internet au quotidien ----------
  {
    id: "cat-net-1",
    titre: "Ouvrir Internet et aller sur un site",
    domaine: "Internet au quotidien",
    niveau: 1,
    statut: "publie",
    corps: `OUVRIR INTERNET :
On ouvre Internet en touchant l'icône du navigateur (une boussole, un globe ou un "e" selon l'appareil).

LA BARRE D'ADRESSE :
Tout en haut, la longue barre sert à écrire soit une adresse, soit ce que vous cherchez. C'est le point de départ de tout.

REVENIR EN ARRIÈRE :
La flèche vers la gauche vous ramène à la page précédente. On ne peut pas se perdre : cette flèche revient toujours en arrière.

À RETENIR :
Internet, c'est une immense bibliothèque. La barre en haut est votre guichet d'accueil.`,
    situation:
      "MISE EN SITUATION : Vous êtes arrivé sur une page qui ne vous intéresse pas. Quel bouton utilisez-vous pour revenir à la page d'avant ?",
    quiz: [
      {
        q: "À quoi sert la barre tout en haut du navigateur ?",
        options: [
          "À écrire une adresse ou une recherche",
          "À régler le volume",
          "À éteindre l'appareil",
        ],
        bonne: 0,
        bravo: "Exactement, c'est le point de départ de toute navigation.",
        aide: "La barre du haut sert à taper une adresse ou une recherche.",
      },
    ],
  },
  {
    id: "cat-net-2",
    titre: "Faire une recherche sur Google",
    domaine: "Internet au quotidien",
    niveau: 2,
    statut: "publie",
    corps: `POSER SA QUESTION SIMPLEMENT :
Écrivez votre question comme si vous parliez à quelqu'un : "horaires pharmacie de garde Versailles" ou "recette gâteau au yaourt".

LIRE LES RÉSULTATS :
Google propose une liste. Les premiers résultats sont souvent les plus utiles. Touchez celui dont le titre correspond le mieux.

AFFINER SI BESOIN :
Si le résultat ne convient pas, revenez en arrière et ajoutez un mot à votre question pour être plus précis.

À RETENIR :
Il n'y a pas de mauvaise question. Google comprend le langage de tous les jours.`,
    situation:
      "MISE EN SITUATION : Vous cherchez l'heure du prochain train pour Paris. Que tapez-vous dans la barre de recherche ?",
    quiz: [
      {
        q: "Comment formuler une recherche ?",
        options: [
          "Avec des mots compliqués d'informatique",
          "Comme une question de tous les jours",
          "Uniquement en majuscules",
        ],
        bonne: 1,
        bravo: "Voilà : on parle à Google normalement, simplement.",
        aide: "On écrit sa question avec des mots simples, comme à l'oral.",
      },
    ],
  },
  {
    id: "cat-net-3",
    titre: "Retrouver une photo ou un document",
    domaine: "Internet au quotidien",
    niveau: 3,
    statut: "publie",
    corps: `L'APPLICATION PHOTOS :
Toutes vos photos sont rangées au même endroit : l'application "Photos" (ou "Galerie"). Elle les classe par date automatiquement.

CHERCHER PAR DATE :
Les photos récentes sont en bas. Faites glisser votre doigt vers le haut pour remonter dans le temps.

LES DOCUMENTS REÇUS :
Un document reçu par e-mail se retrouve dans "Téléchargements" ou "Fichiers". Il n'est jamais perdu, juste rangé.

À RETENIR :
Rien ne disparaît sur un appareil : tout est rangé dans un dossier. Il suffit de savoir lequel.`,
    situation:
      "MISE EN SITUATION : Votre fille vous a envoyé une photo la semaine dernière et vous voulez la revoir. Dans quelle application la cherchez-vous ?",
    quiz: [
      {
        q: "Où sont rangées vos photos ?",
        options: ["Dans l'application Photos ou Galerie", "Dans la corbeille", "Nulle part, elles disparaissent"],
        bonne: 0,
        bravo: "C'est ça, tout est rassemblé dans Photos.",
        aide: "Les photos sont dans l'application Photos (ou Galerie).",
      },
    ],
  },

  // ---------- E-mails et démarches ----------
  {
    id: "cat-mail-1",
    titre: "Envoyer son premier e-mail",
    domaine: "E-mails et démarches",
    niveau: 1,
    statut: "publie",
    corps: `POURQUOI C'EST UTILE :
Envoyer un e-mail permet de garder le contact avec votre famille et de faire vos démarches sans vous déplacer.

LES ÉTAPES, UNE PAR UNE :
1. Ouvrez votre boîte mail.
2. Appuyez sur le bouton "Écrire" (souvent un crayon).
3. Tapez l'adresse de la personne, puis un titre et votre message.
4. Appuyez sur "Envoyer".

L'ADRESSE E-MAIL :
Une adresse contient toujours un @ (arobase). Sans le @, le message ne peut pas partir.

À RETENIR :
Prenez votre temps. Une faute de frappe n'a jamais cassé un ordinateur, et tout peut se corriger avant d'envoyer.`,
    situation:
      "MISE EN SITUATION : Votre fille vous a envoyé une photo de vos petits-enfants. Vous voulez répondre « merci, ils ont bien grandi ! ». Par quoi commencez-vous ?",
    quiz: [
      {
        q: "Pour écrire un nouveau message, sur quel bouton appuyez-vous ?",
        options: ["Supprimer", "Écrire", "Fermer"],
        bonne: 1,
        bravo: "Exactement ! « Écrire » ouvre un message tout neuf.",
        aide: "C'est le bouton « Écrire » (souvent un crayon) qui commence un message.",
      },
      {
        q: "Qu'est-ce qu'une adresse e-mail contient toujours ?",
        options: ["Un @ (arobase)", "Un numéro de téléphone", "Une virgule"],
        bonne: 0,
        bravo: "Bravo, le @ est indispensable dans toute adresse.",
        aide: "Toute adresse e-mail contient le signe @.",
      },
    ],
  },
  {
    id: "cat-mail-2",
    titre: "Ouvrir et envoyer une pièce jointe",
    domaine: "E-mails et démarches",
    niveau: 2,
    statut: "publie",
    corps: `QU'EST-CE QU'UNE PIÈCE JOINTE :
C'est un fichier (photo, document) accroché à un e-mail, comme une pièce glissée dans une enveloppe.

OUVRIR CE QU'ON REÇOIT :
Un petit trombone ou une vignette signale une pièce jointe. Touchez-la pour l'ouvrir : elle s'affiche sans danger.

JOINDRE UNE PHOTO À SON MESSAGE :
Dans un message, touchez le trombone, choisissez "Photos", puis la photo voulue. Elle s'accroche toute seule.

À RETENIR :
Ouvrir une pièce jointe d'un proche est sans risque. On reste seulement prudent avec les inconnus.`,
    situation:
      "MISE EN SITUATION : Vous voulez envoyer à votre médecin la photo d'une ordonnance. Quel bouton cherchez-vous dans votre message ?",
    quiz: [
      {
        q: "Quel symbole signale souvent une pièce jointe ?",
        options: ["Un trombone", "Une cloche", "Un cadenas"],
        bonne: 0,
        bravo: "C'est bien le trombone qui sert à joindre un fichier.",
        aide: "Le petit trombone permet d'ajouter ou d'ouvrir une pièce jointe.",
      },
    ],
  },
  {
    id: "cat-mail-3",
    titre: "Se connecter à un compte (Ameli, impôts)",
    domaine: "E-mails et démarches",
    niveau: 3,
    statut: "publie",
    corps: `IDENTIFIANT ET MOT DE PASSE :
Se connecter, c'est prouver que c'est bien vous, avec deux informations : votre identifiant et votre mot de passe.

TROUVER LE BON SITE :
Passez toujours par le site officiel : ameli.fr, impots.gouv.fr. Méfiez-vous des liens reçus par message.

LE BOUTON "SE CONNECTER" :
Il est en général en haut à droite. On y saisit ses informations, puis on valide.

À RETENIR :
Un site officiel se termine par .fr ou .gouv.fr. En cas de doute, on tape l'adresse soi-même plutôt que de cliquer sur un lien.`,
    situation:
      "MISE EN SITUATION : Vous recevez un SMS avec un lien vers « votre compte Ameli ». Que vaut-il mieux faire pour vous connecter en sécurité ?",
    quiz: [
      {
        q: "Comment accéder en sécurité à son compte Ameli ?",
        options: [
          "Cliquer sur le lien reçu par SMS",
          "Taper soi-même ameli.fr dans le navigateur",
          "Demander à un inconnu",
        ],
        bonne: 1,
        bravo: "Parfait : on tape l'adresse officielle soi-même.",
        aide: "On évite les liens reçus et on tape ameli.fr soi-même.",
      },
    ],
  },

  // ---------- Sécurité et confiance ----------
  {
    id: "cat-secu-1",
    titre: "Faire les mises à jour en confiance",
    domaine: "Sécurité et confiance",
    niveau: 1,
    statut: "publie",
    corps: `À QUOI SERVENT LES MISES À JOUR :
Une mise à jour, c'est un petit entretien : elle corrige des défauts et protège votre appareil. C'est une bonne nouvelle, pas un problème.

RECONNAÎTRE UNE VRAIE DEMANDE :
La vraie demande vient de l'appareil lui-même, dans les Réglages. Elle ne réclame jamais d'argent ni votre carte bancaire.

QUAND LA FAIRE :
Le soir, branché et connecté au wifi, c'est le moment idéal. On laisse faire, ça se termine tout seul.

À RETENIR :
Mettre à jour = protéger. Une demande qui réclame un paiement n'est pas une vraie mise à jour.`,
    situation:
      "MISE EN SITUATION : Votre tablette affiche « une mise à jour est disponible ». Une fenêtre séparée réclame 30 € pour « accélérer ». Laquelle est fiable ?",
    quiz: [
      {
        q: "Une vraie mise à jour peut-elle réclamer un paiement ?",
        options: ["Oui, c'est normal", "Non, jamais"],
        bonne: 1,
        bravo: "Exact : une vraie mise à jour est toujours gratuite.",
        aide: "Une mise à jour officielle ne demande jamais d'argent.",
      },
    ],
  },
  {
    id: "cat-secu-2",
    titre: "Reconnaître un e-mail ou un SMS d'arnaque",
    domaine: "Sécurité et confiance",
    niveau: 2,
    statut: "publie",
    corps: `LE PRINCIPE DE L'ARNAQUE :
Les arnaqueurs imitent votre banque ou un service connu pour vous faire peur et vous pousser à agir vite. La peur et l'urgence sont leurs armes.

LES SIGNES QUI ALERTENT :
- On vous demande de cliquer en urgence.
- On réclame votre mot de passe ou votre code de carte.
- L'adresse de l'expéditeur est étrange.
- Il y a des fautes d'orthographe.

LE BON RÉFLEXE :
Dans le doute, on ne clique pas. On appelle l'organisme avec le numéro qu'on connaît, jamais celui du message.

À RETENIR :
Aucune banque, aucun service sérieux ne demande votre mot de passe par message. En cas de doute, on n'agit pas dans la précipitation.`,
    situation:
      "MISE EN SITUATION : Un SMS annonce que votre colis est bloqué et demande 2 € via un lien. Que faites-vous ?",
    quiz: [
      {
        q: "Un e-mail réclame votre mot de passe en urgence. Que faites-vous ?",
        options: [
          "Je réponds vite avec mon mot de passe",
          "Je ne réponds pas et je vérifie par téléphone",
          "Je clique pour voir",
        ],
        bonne: 1,
        bravo: "Bravo, c'est le bon réflexe : on ne donne jamais son mot de passe.",
        aide: "Un organisme sérieux ne demande jamais votre mot de passe par message.",
      },
      {
        q: "Quel signe doit vous alerter ?",
        options: ["Un message calme et poli", "Une urgence et une demande d'argent", "Un message de votre famille"],
        bonne: 1,
        bravo: "Oui : l'urgence et l'argent sont des signaux d'alarme.",
        aide: "L'urgence et la demande d'argent sont des signes d'arnaque.",
      },
    ],
  },
  {
    id: "cat-secu-3",
    titre: "Gérer ses mots de passe sans les perdre",
    domaine: "Sécurité et confiance",
    niveau: 3,
    statut: "publie",
    corps: `UN BON MOT DE PASSE :
Un bon mot de passe est long et facile à retenir pour vous : par exemple une petite phrase, "MonChatMange3Croquettes".

LE NOTER EN SÉCURITÉ :
Un carnet papier rangé chez vous est une solution simple et sûre. L'important est de ne pas le laisser près de l'appareil.

NE PAS TOUT MÉLANGER :
Évitez le même mot de passe partout. Si l'un est découvert, les autres restent protégés.

À RETENIR :
Un mot de passe, c'est la clé de votre maison numérique. On le garde pour soi et on le note dans un endroit connu de vous seul.`,
    situation:
      "MISE EN SITUATION : Vous créez un compte et devez choisir un mot de passe. Vous voulez pouvoir le retenir sans le mélanger avec les autres. Comment vous y prenez-vous ?",
    quiz: [
      {
        q: "Qu'est-ce qu'un bon mot de passe ?",
        options: [
          "Court et simple comme 1234",
          "Long et facile à retenir pour vous",
          "Le même partout",
        ],
        bonne: 1,
        bravo: "Parfait : long, personnel, et mémorisable pour vous.",
        aide: "Un bon mot de passe est long et facile à retenir pour vous.",
      },
    ],
  },
]
