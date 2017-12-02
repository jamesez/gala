# frozen_string_literal: true

require 'rails_helper'

feature 'Moderating a comment thread' do
  let!(:enrollment) { create :enrollment, reader: create(:reader, :editor) }
  let!(:global_forum) { enrollment.case.forums.find_by community: nil }
  let!(:other_reader) { create :reader }
  let!(:comment_thread) do
    first_card = enrollment.case.pages.first.cards.first
    first_letter = first_card.paragraphs[0][0]
    first_card.comment_threads.create(
      start: 0,
      length: 1,
      block_index: 0,
      original_highlight_text: first_letter,
      reader: other_reader,
      locale: I18n.locale,
      forum: global_forum
    )
  end
  let!(:comment) do
    comment_thread.comments.create(
      content: 'Bad comment',
      reader: other_reader
    )
  end

  before { login_as enrollment.reader }

  it 'is possible to delete a comment as an editor' do
    visit comment_thread_path(:en, comment_thread)
    accept_confirm 'Are you sure' do
      find('.Comment').hover
      find('[aria-label="Delete comment"]').click
    end
    expect(page).not_to have_content 'Bad comment'
    find('[aria-label="Delete comment thread"]').click
    expect(page).not_to have_content 'No comment'
  end
end