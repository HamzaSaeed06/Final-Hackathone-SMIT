export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, 
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' }
  })
};

export const slideIn = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35 } },
  exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0, transition: { duration: 0.25 } })
};
