/**
 * The card of Page options for editing
 *
 * @providesModule DetailsForm
 * @flow
 */

import * as React from 'react'
import styled from 'styled-components'
import { Button, FormGroup, InputGroup } from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'

import type { Page } from 'redux/state'

type Props = {
  page: Page,
  onChange: ($Shape<Page>) => mixed,
  onDelete: () => mixed,
}

const DetailsForm = ({
  page: { title, iconSlug },
  onChange,
  onDelete,
}: Props) => (
  <Container>
    <Header>
      <FormattedMessage id="pages.edit.pageSettings" />
    </Header>

    <Row>
      <FormGroup
        label={<FormattedMessage id="activerecord.attributes.page.title" />}
        labelFor="page_title"
      >
        <InputGroup
          id="page_title"
          value={title}
          onChange={e => onChange({ title: e.target.value })}
        />
      </FormGroup>

      {iconSlug && (
        <FormGroup
          label={
            <FormattedMessage id="activerecord.attributes.page.iconSlug" />
          }
          labelFor="page_icon_slug"
        >
          <InputGroup
            id="page_icon_slug"
            defaultValue={iconSlug}
            onBlur={e => onChange({ iconSlug: e.target.value })}
          />
        </FormGroup>
      )}
    </Row>

    <DeleteButton onClick={onDelete}>Delete Page</DeleteButton>
  </Container>
)
export default DetailsForm

const Container = styled.fieldset.attrs({ className: 'pt-card' })`
  background-color: rgba(37, 57, 75, 0.5) !important;
  border: 1px solid white;
  box-shadow: none !important;
  flex: 0 1 47em;
  margin: 1em;

  @media (max-width: 1440px) {
    flex: 0 1 37em;
  }
`

const Header = styled.legend``

const Row = styled.div`
  display: flex;
  margin-left: -1em;

  & > * {
    flex: 1;
    margin-left: 1em;

    &:first-child {
      flex: 2;
    }
  }
`

const DeleteButton = styled(Button).attrs({
  className: 'c-delete-element pt-intent-danger pt-icon-trash',
})``
