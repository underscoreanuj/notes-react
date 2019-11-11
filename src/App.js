import React, { Component } from 'react';
import './App.css';

import firebase, { SignIn } from './Firebase';

import NoteList from './components/NoteList';
import NoteDetail from './components/NoteDetail';
import Composer from './components/Composer';
import Splash from './components/Splash';
import Button from './components/Button';


class App extends Component {

  constructor(props) {
    super(props);

    this.handleDeleteNote = this.handleDeleteNote.bind(this);
    this.handleAddNote = this.handleAddNote.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
    this.handleNotes = this.handleNotes.bind(this);
    this.handleArchiveClick = this.handleArchiveClick.bind(this);
    
    this.ref = firebase.firestore().collection('notes');

    this.state = {
      user: null,
      opt: 'notes',
      notes: [],
      archive: [],
      loading: true,
      timePassed: false,
    };
  }

  componentDidMount() {

    setTimeout( () => {
      this.setTimePassed();
    },3000);
    
    this.setState({
      user: null,
      notes: [],
      archive: [],
    });
    
    this.updateData();
  }

  updateData = () => {
    let thisComp = this;

    const auth = firebase.auth();
    const user = auth.currentUser;

    const {opt} = this.state;
    
    if (user !== null) {

      this.ref.doc(user.email).collection('archive').onSnapshot((querySnapshot) => {
        let archive = [];
        querySnapshot.forEach((doc) => {
          const { title, content } = doc.data();
          archive.push({
            key: doc.id,
            doc,
            title,
            content,
          });
        });
        this.setState({
              user,
              archive: archive,
              loading: false,
          });
      });

      this.ref.doc(user.email).collection('notes').onSnapshot((querySnapshot) => {
        let notes = [];
        querySnapshot.forEach((doc) => {
          const { title, content } = doc.data();
          notes.push({
            key: doc.id,
            doc,
            title,
            content,
          });
        });
        this.setState({
              user,
              notes: notes,
              loading: false,
          });
      });
      
    } else {
      setTimeout(this.updateData, 50);
    }

  }

  setTimePassed() {
    this.setState({timePassed: true});
  }

  handleAddNote = note => {

    const {user} = this.state;
    const {opt} = this.state;

    this.ref.doc(user.email).collection(opt).add(note)
    .then((docRef) => {
      this.props.history.push("/")
    })
    .catch((error) => {
      console.error("Error adding note: ", error);
    });
  }

  handleUpdateNote = note => {
    const {user} = this.state;
    const {opt} = this.state;

    const updateRef = this.ref.doc(user.email).collection(opt).doc(note.key);
    const {title} = note;
    const {content} = note;

    updateRef.set({
      title,
      content
    }).then((docRef) => {
      console.log('Note successfully updated');
      window.history.back();
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  };

  handleDeleteNote = note => {
    const {user} = this.state;
    const {opt} = this.state;

    firebase.firestore().collection('notes').doc(user.email).collection(opt).doc(note.key).delete().then(() => {
      console.log("Note successfully deleted!");
      window.history.back();
    }).catch((error) => {
      console.error("Error removing note: ", error);
    });
  };

  handleArchive = note => {
    // console.log('archive');

    const {user} = this.state;

    const to_delete = {
      title: note.title,
      content: note.content
    }
    

    this.ref.doc(user.email).collection('archive').add(to_delete)
    .then((docRef) => {
      this.handleDeleteNote(note);
      this.props.history.push("/");
    })
    .catch((error) => {
      console.error("Error archiving note: ", error);
    });

  }

  handleNotes () {
    this.setState({
      opt: 'notes',
      notes: [],
      loading: true
    });

    this.updateData();

  }
  
  handleArchiveClick () {
    this.setState({
      opt: 'archive',
      notes: [],
      loading: true
    });

    this.updateData();

  }


  render() {

    const {timePassed} = this.state
    const {notes} = this.state;
    const {archive} = this.state;
    const {user} = this.state;
    const {loading} = this.state
    const {opt} = this.state;

    return (
      <div className="App">

      {(timePassed) ? 
          <div>
            {(user === null) ? <SignIn />
      :
      <div>
        {(loading && notes.length <= 0) ? <div>loading...</div> :

          <div>
            {(opt === 'notes') ? 
            <div>

            <Composer 
              onSubmit={this.handleAddNote} 
              /> 
              <Button onClick={this.handleNotes}>Notes</Button>
              <Button onClick={this.handleArchiveClick}>Archived</Button>
              <NoteList 
              notes={notes} 
              onDelete={this.handleDeleteNote}
              onArchive={this.handleArchive}
              />
              <NoteDetail
              onUpdate={this.handleUpdateNote}
              onDelete={this.handleDeleteNote}
              onArchive={this.handleArchive}
              notes={notes}
              location={this.props.location}
              isArchive={(opt === 'notes') ? false : true}
              />

            </div>
              : 
              
              <div>

              <Button onClick={this.handleNotes}>Notes</Button>
              <Button onClick={this.handleArchiveClick}>Archived</Button>
              <NoteList 
              notes={archive} 
              onDelete={this.handleDeleteNote}
              onArchive={this.handleArchive}
              />
              <NoteDetail
              onUpdate={this.handleUpdateNote}
              onDelete={this.handleDeleteNote}
              onArchive={this.handleArchive}
              notes={archive}
              location={this.props.location}
              isArchive={(opt === 'notes') ? false : true}
              />

            </div>

              }
              
          </div>
        
      }
      </div>
      }
          </div>
      :
      <div>
        <Splash />
      </div>
      }
      
      </div>
    );
  }

}

export default App;
