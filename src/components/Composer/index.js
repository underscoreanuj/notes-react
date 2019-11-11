import React, { Component } from 'react';
import './composer.css';
import Input from '../Input';
import Button from '../Button';
import Textarea from '../Textarea';

const initialState = {
  title: {
    value: ''
  },
  content: {
    value: ''
  }
};

const noteToState = note => {
  return {
    title: {
      value: note.title,
    },
    content: {
      value: note.content,
    }
  };
}

class Composer extends Component {
  constructor(props) {
    super(props);

    this.handleArchive = this.handleArchive.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    let state = initialState;
    if (props.note) {
      state = noteToState(props.note);
    }

    this.state = state;
  }

  handleChange = event => {
    const fieldName = event.target.name;

    this.setState({
      [fieldName]: {
        value: event.target.value
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { onSubmit, note } = this.props;
    
    const title = this.state.title.value;
    
    const content = this.state.content.value.replace(/\n/g, '</br>');

    const newNote = {
      title,
      content
    }

    if (note) {
      newNote.key = note.key;
    }

    onSubmit(newNote);

    this.setState(initialState);
  };

  getValue = fieldName => {
    return this.state[fieldName].value;
  };

  handleDelete = event => {
    event.preventDefault();
    this.props.onDelete && this.props.onDelete(this.props.note);
  }

  handleArchive = event => {
    event.preventDefault();
    this.props.onArchive && this.props.onArchive(this.props.note); 
  }

  render() {
    const { isEdit } = this.props;
    const { isArchive } = this.props;

    return (
      <div className={`card composer-container ${isEdit ? 'edit' : ''}`}>
        <form onSubmit={this.handleSubmit} className="input-form">
          <Input
            type="text"
            name="title"
            placeholder="Title"
            autoFocus
            value={this.getValue('title')}
            onChange={this.handleChange}
          />
          <Textarea
            className="note-content"
            name="content"
            placeholder="Take a note..."
            value={this.getValue('content')}
            onChange={this.handleChange}
          />

          <div className="actions">
            {isEdit && <Button className='delbtn' onClick={this.handleDelete}>Delete</Button>}
            {isEdit && !isArchive && <Button onClick={this.handleArchive}>Archive</Button>}
            <Button>Done</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default Composer;
