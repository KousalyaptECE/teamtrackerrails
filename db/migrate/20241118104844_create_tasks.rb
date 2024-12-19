class CreateTasks < ActiveRecord::Migration[8.0]  # Adjust version number as per your Rails version
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :description
      t.references :project, null: false, foreign_key: true  # Project association
      t.references :assigned_to, null: false, foreign_key: { to_table: :users }  # Assigned user association
      t.integer :estimated_time
      t.date :due_date
      t.string :labels

      t.timestamps
    end
  end
end
