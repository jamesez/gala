import React from 'react'
import { connect } from 'react-redux'
import { DragSource, DropTarget } from 'react-dnd'
import { NavLink, withRouter } from 'react-router-dom'

import { ItemTypes } from 'concerns/dndConfig.js'
import Icon from 'Icon.js'

import {
  updateCaseElement,
  persistCaseElementReordering,
} from 'redux/actions.js'


function getElementDataFrom(state) {
  return ({elementStore: store, elementId: id}) => {
    const {title, iconSlug} = state[store][id]
    const typeIcon = iconSlug && <Icon filename={iconSlug} />

    return { title, typeIcon }
  }
}


const TableOfContentsElement = ({position, element, connectDragSource,
  connectDropTarget, isDragging}) =>
  connectDragSource(connectDropTarget(
    <div className="c-toc__draggable">
      <NavLink className="c-toc__link"
        activeClassName="c-toc__link--active"
        to={`/${position}`}
        style={{opacity: isDragging ? 0 : 1}}
      >
        <li className="c-toc__item">
          <div className="c-toc__item-data">
            <div className="c-toc__number">{position}</div>
            <div className="c-toc__title">{element.title}</div>
            <div className="c-toc__icon">{element.typeIcon}</div>
          </div>
        </li>
      </NavLink>
    </div>
  ))

const DraggableTableOfContentsElement = DropTarget(
  ItemTypes.CASE_ELEMENT,
  {
    canDrop() { return false },
    hover(props, monitor) {
      const { id: draggedId } = monitor.getItem()
      const { id: overId } = props

      if (draggedId !== overId) {
        const { index: overIndex } = props.findElement(overId)
        props.updateCaseElement(draggedId, overIndex)
      }
    },
  },
  connect => ({
    connectDropTarget: connect.dropTarget(),
  })
)(
  DragSource(
    ItemTypes.CASE_ELEMENT,
    {
      beginDrag(props) {
        return {
          id: props.id,
          originalIndex: props.findElement(props.id).index,
        }
      },
      endDrag(props, monitor) {
        const { id: droppedId, originalIndex } = monitor.getItem()
        const { index: droppedIndex } = props.findElement(droppedId)
        const didDrop = monitor.didDrop()

        if (didDrop) {
          props.persistCaseElementReordering(droppedId, droppedIndex)
        } else {
          props.updateCaseElement(droppedId, originalIndex)
        }
      },
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  )(
    TableOfContentsElement
  )
)

export default withRouter(
  connect(
    (state, {element}) => ({
      ...element,
      element: getElementDataFrom(state)(element),
      findElement: (id) => {
        const { caseElements } = state.caseData
        return { element, index: caseElements.findIndex(e => e.id === id) }
      },
    }),
    { updateCaseElement, persistCaseElementReordering },
  )(DraggableTableOfContentsElement)
)