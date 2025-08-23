import NavBar from './partials/NavBar'; // Ensure exact filename case
import Logo from './partials/Logo';
import React ,{useState} from 'react';
import Tag from './partials/tag';
import SubjectManager from './partials/SubjectManager';
import {Chart} from './partials/Chart';

export default function Profile() {
  const [chosen, setChosen] = useState(null);
  return (
    <>
      <NavBar />
      <br />
      <h3>Pick a subject</h3>
      <SubjectManager />
      <Chart/>
    </>
  );
}
