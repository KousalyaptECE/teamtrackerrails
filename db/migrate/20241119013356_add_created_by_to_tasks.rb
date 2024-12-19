class AddCreatedByToTasks < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :created_by, :integer
  end
end
