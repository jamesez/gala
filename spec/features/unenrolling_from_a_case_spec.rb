# frozen_string_literal: true

require 'rails_helper'

feature 'Unenrolling from a case' do
  let!(:reader) { create :reader, :editor }

  scenario 'is possible' do
    kase = create :case_with_elements, :published
    kase.enrollments.create(reader: reader)

    login_as reader
    find('[aria-label="Edit enrolled cases"]').click
    accept_confirm /\AAre you sure you want to unenroll in this case\?\Z/ do
      find('[aria-label="Unenroll from this case"]').click
    end
    page.driver.browser.navigate.refresh

    find('[aria-label="Edit enrolled cases"]').click
    expect(page).not_to have_selector '[aria-label="Unenroll from this case"]'
  end

  scenario 'displays an extra warning if the case is not published' do
    kase = create :case_with_elements
    kase.enrollments.create(reader: reader)

    login_as reader
    find('[aria-label="Edit enrolled cases"]').click
    accept_confirm 'Because this case is not published, you will need another invitation to reenroll.' do
      find('[aria-label="Unenroll from this case"]').click
    end
    page.driver.browser.navigate.refresh

    find('[aria-label="Edit enrolled cases"]').click
    expect(page).not_to have_selector '[aria-label="Unenroll from this case"]'
  end
end