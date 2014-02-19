class CreateRooms < ActiveRecord::Migration
  def change
      t.string :name
      t.text :tags
      t.text :description
      t.references :user
  end
end
