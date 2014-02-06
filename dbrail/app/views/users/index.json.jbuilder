json.array!(@users) do |user|
  json.extract! user, :id, :email, :pw, :uname
  json.url user_url(user, format: :json)
end
