class AddStateToTasks < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :state, :string, default: 'opened', null: false
  end
end
