export const SOUND_GROUPS = [
  {
    title: 'Sound Scape',
    description:
      'Ambienti continui per accompagnare il respiro senza chiedere attenzione.',
    sounds: [
      {
        title: 'Neural Dream',
        url: 'https://www.youtube.com/watch?v=IKa5SBJA2dU',
        id: 'IKa5SBJA2dU',
      },
      {
        title: 'Mellow Psychedelic Journey',
        url: 'https://www.youtube.com/watch?v=XJrS3wFmiZw',
        id: 'XJrS3wFmiZw',
      },
      {
        title: 'Rain in the Green City of the Future',
        url: 'https://www.youtube.com/watch?v=QP1tUfbPvlg',
        id: 'QP1tUfbPvlg',
      },
      {
        title: 'Waterfront Market',
        url: 'https://www.youtube.com/watch?v=4bTw5IKUwZ4',
        id: '4bTw5IKUwZ4',
      },
    ],
  },
  {
    title: 'Relaxing Storytelling',
    description:
      'Viaggi narrativi morbidi da usare quando vuoi lasciare che una voce accompagni la sessione.',
    sounds: [
      {
        title: 'Aerolab Station',
        url: 'https://www.youtube.com/watch?v=YqWZK6TVOSY&t=1s',
        id: 'YqWZK6TVOSY',
      },
      {
        title: 'Asteroid Forge',
        url: 'https://www.youtube.com/watch?v=Pvnvjqzj1O0&t=3s',
        id: 'Pvnvjqzj1O0',
      },
    ],
  },
  {
    title: 'Bonus',
    description:
      'Un piccolo omaggio alle radici psichedeliche di LUCY//ROOTS.',
    sounds: [
      {
        title: 'Lucy in the Sky with Diamonds (cover)',
        url: 'https://www.youtube.com/watch?v=5_3cPTuab6Q',
        id: '5_3cPTuab6Q',
      },
    ],
  },
];

export const SOUND_OPTIONS = SOUND_GROUPS.flatMap(
  (group) => group.sounds,
);
