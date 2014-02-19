class CreateH2omodules < ActiveRecord::Migration
  def change
    create_table :h2omodules do |t|
      t.string :name

      t.timestamps
    end
  end
end
