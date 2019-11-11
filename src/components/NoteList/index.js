import React from 'react';
import './note-list.css';
import Note from '../Note';
import Mansory from 'react-masonry-component';
import { Link } from 'react-router-dom';

const options = {
  fitWidth: true
};

const noteStyle = {
  width: 240,
  textDecoration: 'none',
  color: 'inherit'
};

const handleClick = (note, event) => {
  window.activeNote = {
    note,
    layout: event.currentTarget.getBoundingClientRect()
  }
  
}

const NoteList = ({ notes }) => {
  
  return (
    <div>
      <Mansory className="note-list-container" options={options}>
        {notes.map((note, index) =>
          <Link key={index} to={`/notes/${note.key}`} onClick={event => handleClick(note, event)} style={noteStyle}>
            <Note title={note.title} description={note.content} />
          </Link>
        )}
      </Mansory>
    </div>
  );
};

export default NoteList;
