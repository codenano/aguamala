class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :email
      t.string :pw
      t.string :uname

      t.timestamps
    end
  end
end
