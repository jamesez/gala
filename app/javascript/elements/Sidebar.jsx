/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import BillboardTitle from 'overview/BillboardTitle'
import CommunityChooser from 'overview/CommunityChooser'
import TableOfContents from 'overview/TableOfContents'
import EnrollForm from 'overview/EnrollForm'

function mapStateToProps (state) {
  return {
    readerEnrolled: !!state.caseData.reader.enrollment,
  }
}

const Sidebar = ({ editing, readerEnrolled }) => {
  return (
    <aside id="Sidebar">
      <BillboardTitle minimal />
      {editing || <CommunityChooser rounded />}
      <TableOfContents onSidebar />

      {readerEnrolled || (
        <div style={{ paddingTop: '1em' }}>
          <EnrollForm />
        </div>
      )}
    </aside>
  )
}

export default connect(mapStateToProps)(Sidebar)
