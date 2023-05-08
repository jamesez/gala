/**
 * @providesModule Acknowledgements
 * @flow
 */

import * as React from 'react'
import styled from 'styled-components'

import { injectIntl, FormattedMessage } from 'react-intl'
import { Dialog, Button } from '@blueprintjs/core'

import type { IntlShape } from 'react-intl'

class Acknowledgements extends React.Component<
  { contents: string, intl: IntlShape },
  *
> {
  state = { isOpen: false }

  handleClick = (e: SyntheticMouseEvent<*>) => {
    e.stopPropagation()
    this.setState(({ isOpen }: $PropertyType<Acknowledgements, 'state'>) => ({
      isOpen: !isOpen,
    }))
  }

  render () {
    const { contents, intl } = this.props
    if (!contents) return null
    const acknowledgements = intl.formatMessage({
      id: 'activerecord.attributes.case.acknowledgements',
    })
    return [
      <AcknowledgementsButton
        key="1"
        aria-label={acknowledgements}
        title={acknowledgements}
        onClick={this.handleClick}
      />,
      <Dialog
        key="2"
        title={acknowledgements}
        className="bp4-dark"
        {...this.state}
        onClose={this.handleClick}
      >
        <div className="bp4-dialog-body">
          <AcknowledgementsContents>{contents}</AcknowledgementsContents>
        </div>
        <div className="bp4-dialog-footer">
          <div className="bp4-dialog-footer-actions">
            <Button onClick={this.handleClick}>
              <FormattedMessage id="helpers.close" />
            </Button>
          </div>
        </div>
      </Dialog>,
    ]
  }
}
export default injectIntl(Acknowledgements)

const AcknowledgementsButton = styled(Button).attrs({
  className: 'bp4-minimal bp4-small bp4-button--baseline-aligned',
  icon: 'more',
})`
  margin-left: 0.25em;
`

const AcknowledgementsContents = styled.p.attrs({
  className: 'bp4-running-text',
})`
  white-space: pre-wrap;
  margin: 0;
`
