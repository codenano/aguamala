json.array!(@h2omodules) do |h2omodule|
  json.extract! h2omodule, :id, :name
  json.url h2omodule_url(h2omodule, format: :json)
end
