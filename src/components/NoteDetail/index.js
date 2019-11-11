import React, { Component } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { Link, Route } from 'react-router-dom';
import './note-detail.css';
import Composer from '../Composer';

const fadeIn = [
  {
    opacity: 0
  },
  {
    opacity: 1
  }
];

const fadeInBackdrop = [
  {
    opacity: 0
  },
  {
    opacity: 0.75
  }
];

const defaultAnimationTiming = {
  duration: 500,
  easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
}

const getTranformation = (boundingRect) => {
  const keyFrames = []

  if (window.activeNote) {
    const scaledWidth = window.activeNote.layout.width / boundingRect.width
    const scaledHeight = window.activeNote.layout.height / boundingRect.height

    keyFrames.push({
      transform: `translate(${window.activeNote.layout.left}px, ${window.activeNote.layout.top}px) scale(${scaledWidth}, ${scaledHeight})`,
      opacity: 0
    })
  }

  const targetLeft = window.innerWidth / 2 - boundingRect.width / 2

  keyFrames.push({
    transform: `translate(${targetLeft}px, 180px) scale(1, 1)`,
    opacity: 1
  })

  return keyFrames;
}

const fadeOut = [...fadeIn].reverse();

class NoteDetail extends Component {
  constructor() {
    super()
    this.state = {
      active: false
    }

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentWillEnter(callback) {
    this._modalBackdrop.animate(fadeInBackdrop, defaultAnimationTiming);
    
    const modalLayout = this._modalContent.getBoundingClientRect()
    const tranformation = getTranformation(modalLayout);
    const fadeInAnimation = this._modalContent.animate(tranformation, defaultAnimationTiming);

    fadeInAnimation.onfinish = () => {
      const targetLeft = window.innerWidth / 2 - modalLayout.width / 2
      this._modalContent.style.transform = `translate(${targetLeft}px , 180px)`

      callback();
    }

    fadeInAnimation.play();
  }

  startAnimation() {

  }

  componentDidEnter() {
    this._modal.classList.add('active')
  }

  componentDidAppear() {
    this._modal.classList.add('active')
  }

  componentWillLeave(callback) {
    this._modalBackdrop.animate([...fadeInBackdrop].reverse(), defaultAnimationTiming);
    const modalLayout = this._modalContent.getBoundingClientRect()
    const tranformation = getTranformation(modalLayout);
    const fadeOutAnimation = this._modalContent.animate([...tranformation].reverse(), defaultAnimationTiming);

    fadeOutAnimation.onfinish = callback;
    fadeOutAnimation.play();
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      //alert('You clicked outside of me!');
      window.history.back();
    }
  }

  render() {
    const modalClass = this.state.active ? 'active' : ''
    const { note, onUpdate, onDelete, onArchive, isArchive } = this.props
    return (
      <div ref={this.setWrapperRef}>
        <div className={`box-fill modal ${modalClass}`} ref={note => (this._modal = note)}>
          <div className="box-fill modal-backdrop" ref={note => (this._modalBackdrop = note)} onClick={this.startAnimation}/>
          <div
            className="modal-content"
            ref={note => (this._modalContent = note)}>
            <Composer note={note} isEdit isArchive={isArchive} onSubmit={onUpdate} onDelete={onDelete} onArchive={onArchive} />
          </div>
        </div>
      </div>
    );
  }
}

class NoteDetailTransition extends Component {
  render() {
    const { notes, onUpdate, onDelete, onArchive, isArchive } = this.props
    return (
      <Route
        path="/notes/:noteId"
        children={({ match, ...rest }) => {
          let foundNote
          if (match) {
            foundNote = notes.find(note => note.key === match.params.noteId)
          }
          return (
            <TransitionGroup component="div" className="animated-list">
              {match && foundNote && <NoteDetail isArchive={isArchive} onUpdate={onUpdate} onDelete={onDelete} onArchive={onArchive} note={foundNote}/>}
            </TransitionGroup>
          );
        }}
      />
    );
  }
}

export default NoteDetailTransition;