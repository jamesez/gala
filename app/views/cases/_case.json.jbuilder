json.key_format! camelize: :lower
json.extract! c, *%i(slug published kicker title dek case_authors summary tags)
json.cover_url ix_cover_image(c, :billboard)
json.translators translators_string c
json.pages c.pages do |page|
  json.id page.id
  json.position page.position
  json.title page.title
  if reader_signed_in?
    json.cards page.cards do |card|
      json.extract! card, *%i(id position solid content)
    end
  end
end
json.edgenotes do
  json.array! c.edgenotes.map(&:slug)
end
json.podcasts c.podcasts do |podcast|
  json.partial! podcast
end
json.activities c.activities do |activity|
  json.partial! activity
end

if reader_signed_in?
  json.reader do
    json.partial! current_reader
    json.can_update_case current_reader.can_update? c
  end
else
  json.sign_in_form (render partial: 'devise/sessions/sign_in', formats: [:html],
                     locals: {resource: Reader.new})
end