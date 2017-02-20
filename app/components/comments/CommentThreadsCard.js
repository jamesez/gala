import React from 'react'
import { connect } from 'react-redux'
import { Portal } from '@blueprintjs/core'

import {
  closeCommentThreads,
  acceptSelection,
} from 'redux/actions.js'

import CommentThread from 'comments/CommentThread.js'
import CommentsCard from 'comments/CommentsCard.js'

function mapStateToProps(state, ownProps) {
  return {
    commentThreads: state.cardsById[ownProps.cardId].commentThreads,
    acceptingSelection: state.ui.acceptingSelection,
    selectionPending: !state.cardsById[ownProps.cardId].editorState
      .getSelection().isCollapsed(),
    commentThreadSelected: !!state.ui.selectedCommentThread,
  }
}

const CommentThreadsCard = ({commentThreads, acceptingSelection,
                            selectionPending, closeCommentThreads,
                            commentThreadSelected, acceptSelection,
                            addCommentThread}) => {
  const positionalStyles = {
    position: 'absolute',
    top: 0 /* Height of header */,
    right: -266 - 24,
  }

  return <div style={{...styles.commentsCard, ...positionalStyles}}>
    <div style={styles.header}>
      { commentThreads.length === 0
        ? "No responses"
        : `${commentThreads.length} response${commentThreads.length !== 1
                                                ? "s" : ""}` }
    </div>

    <ol style={styles.commentList}>
      { commentThreads.map( (thread, i) => <CommentThread
        threadId={thread.id}
        last={i === commentThreads.length - 1}
      />
      )}
    </ol>

    <button
      onClick={acceptingSelection ? addCommentThread : acceptSelection}
      className="CommentThreads__new-button"
      disabled={acceptingSelection && !selectionPending}
    >
      { !acceptingSelection
        ? "Write a new response"
        : ( !selectionPending ? "Select a few words" : "Respond here" ) }
    </button>

    {
      <Portal>
        <div style={styles.backdrop} onClick={closeCommentThreads}/>
      </Portal>
    }

    { commentThreadSelected && <CommentsCard /> }
  </div>

}

export default connect(
  mapStateToProps,
  {closeCommentThreads, acceptSelection},
)(CommentThreadsCard)


const styles = {
  backdrop: {
    position: 'fixed',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 200,
  },

  commentsCard: {
    backgroundColor: "#7351D4",
    width: 267,
    position: 'absolute',
    color: 'white',
    fontFamily: 'tenso',
    fontWeight: 500,
    fontSize: '12pt',
    boxShadow: '0 0.5em 1em rgba(0,0,0,0.3)',
  },

  header: {
    backgroundColor: '#493092',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: '10pt',
    letterSpacing: 0.6,
    padding: '0.25em 0.25em 0 0.25em',
    borderBottom: '1px solid #351D7A',
  },

  commentList: {
    margin: 0,
    padding: 0,
    minHeight: '1em',
  },
}
