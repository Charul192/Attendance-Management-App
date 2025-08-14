import Navbar from '../assets/partials/NavBar'; // Ensure exact filename case
import Logo from '../assets/partials/Logo';
import React from 'react';
import Tag from '../assets/partials/tag';

export default function Home() {
  return (
    <>
      <Navbar />
            <div style={{ paddingTop: '100px' }}>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem dolore laboriosam ut corporis, non, atque porro hic fuga vel voluptatibus eos officiis enim id! Quia officiis ad eaque natus voluptas impedit deserunt fugit a! Animi quae dolores sint aliquam eveniet repellat cum inventore, deserunt sapiente doloremque deleniti illo, ad ipsam atque rerum fugiat molestiae harum corrupti. At incidunt, placeat autem vero nam dolorum laudantium impedit eos eaque pariatur aperiam voluptatibus ratione magnam, enim neque maxime recusandae ad! Voluptatem sed, distinctio esse aperiam, eligendi voluptate, voluptates incidunt ex magni a recusandae suscipit illum cum ipsam. Ut laboriosam consequuntur dolore quaerat deleniti!</p>
        <Tag/>
      </div> 
    </>
  );
}
