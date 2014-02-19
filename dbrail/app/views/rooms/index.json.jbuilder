json.array!(@rooms) do |room|
  json.extract! room, :id, :name, :tags, :description, :user_id
  json.url room_url(room, format: :json)
end
