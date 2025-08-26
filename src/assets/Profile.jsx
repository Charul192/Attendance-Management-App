import React, {useState} from 'react';
import NavBar from './partials/NavBar';
import Logo from './partials/Logo';
import Tag from './partials/tag';
import SubjectManager from './partials/SubjectManager';

export default function Profile() {
  const [chosen, setChosen] = useState(null);
  return (
    <>
      <NavBar />
      <br />
      <h3>Pick a subject</h3>
      <SubjectManager />
    </>
  );
}
