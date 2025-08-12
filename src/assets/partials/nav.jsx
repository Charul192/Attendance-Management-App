import GooeyNav from './GooeyNav';

// default items (you can export these too if you want)
const defaultItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Register", href: "/register" },
  { label: "Log In", href: "/login" }
];

export default function MyGooeyNav() {
  return (
     <div style={{ position: 'relative' }}>
      <GooeyNav
        items={defaultItems}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        initialActiveIndex={0}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        style={{ height: '60px' }} // add height to nav itself
      />
    </div>
  );
}