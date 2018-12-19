/**
 * The block containing the cover image, title, kicker, and authors names,
 * shared between the case overview and the catalog features block.
 *
 * @providesModule TitleCard
 * @flow
 */

import * as React from 'react'
import styled, { css } from 'styled-components'

import { FormattedList } from 'shared/react-intl'
import { FeaturesCell } from 'catalog/home/shared'

import type { Author } from 'redux/state'

type Props = {
  kicker: string,
  title: string,
  authors: Author[],
  photoCredit: string,
  coverUrl: string,
}

function TitleCard ({ authors, coverUrl, kicker, photoCredit, title }: Props) {
  return (
    <Container>
      <Image src={coverUrl}>
        {/* TODO: LabelForScreenReaders: Photo Credit: */}
        <PhotoCredit>{photoCredit}</PhotoCredit>
      </Image>

      <Title>
        <Kicker>{kicker}</Kicker>
        <Question>{title}</Question>
      </Title>

      <Authors>
        <FormattedList
          list={authors.map(author => (
            <span key={author.name}>{author.name}</span>
          ))}
          truncate={{ after: 3, with: 'et al.' }}
        />
      </Authors>
    </Container>
  )
}

export default TitleCard

const grid = {
  oneColumn: css`
    grid-template-areas: 'image' 'title' 'authors';
    grid-template-columns: auto;
    grid-template-rows: 100px auto auto;
  `,
  twoColumn: css`
    grid-template-areas: 'image title' 'image authors';
    grid-template-columns: minmax(25%, 240px) auto;
  `,
}

function secondRow (style) {
  return css`
    ${FeaturesCell}:nth-last-child(-n + 4) & {
      ${style}
    }
  `
}

function secondRowOrEvery (style) {
  return css`
    @media (max-width: 900px) {
      ${style}
    }

    ${secondRow(style)}
  `
}

function whenImageAbove (style) {
  return css`
    @media (max-width: 900px) {
      ${style}
    }

    ${secondRow(css`
      @media (min-width: 1150px) and (max-width: 1440px) {
        ${style}
      }

      @media (max-width: 900px) {
        ${style}
      }
    `)}
  `
}

const Container = styled.div`
  background-color: hsl(209, 83%, 90%);
  border-radius: 3px;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.2),
    0 2px 6px 0 rgba(0, 0, 0, 0.2);
  display: grid;
  height: 100%;
  overflow: hidden;
  width: 100%;

  ${grid.twoColumn}

  ${secondRow(
    css`
      grid-template-columns: minmax(30%, 125px) auto;
    `
  )}

  ${whenImageAbove(grid.oneColumn)}
`

const Image = styled.div`
  background-color: hsl(209, 53%, 76%);
  background-image: ${p => css`url(${p.src})`};
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  grid-area: image;
  justify-content: flex-end;
  min-height: 100px;
  min-width: 100px;

  box-shadow: inset -1px 0 0 hsla(0, 0%, 0%, 0.2);

  ${whenImageAbove(css`
    box-shadow: inset 0 -1px 0 hsla(0, 0%, 0%, 0.2);
  `)}
`

const PhotoCredit = styled.cite`
  color: hsla(0, 0%, 100%, 0.6);
  font-size: 9px;
  font-style: normal;
  line-height: 11px;
  margin: 3px 5px;
  text-align: end;
  text-transform: uppercase;
`

const Title = styled.h1`
  grid-area: title;

  margin: 30px;

  ${secondRowOrEvery(css`
    margin: 20px;
  `)}
`

const Kicker = styled.span`
  color: hsl(209, 57%, 39%);
  display: block;
  font-family: ${p => p.theme.sansFont};
  font-size: 16px;
  line-height: 17px;
  margin: -1px 0 10px;
`

const Question = styled.span`
  color: hsl(209, 52%, 24%);
  display: block;
  font-family: ${p => p.theme.sansFont};

  font-size: 26px;
  line-height: 26px;

  @media (max-width: 1300px) {
    font-size: 22px;
    line-height: 24px;
  }

  ${secondRowOrEvery(css`
    font-size: 16px;
    line-height: 17px;
  `)}
`

const Authors = styled.div`
  align-self: last baseline;
  color: hsl(209, 63%, 35%);
  font-size: 14px;
  grid-area: authors;
  line-height: 17px;

  margin: 0 30px 30px;

  ${secondRow(css`
    margin: 0 20px 20px;
  `)}

  @media (max-width: 900px) {
    display: none;
  }
`
