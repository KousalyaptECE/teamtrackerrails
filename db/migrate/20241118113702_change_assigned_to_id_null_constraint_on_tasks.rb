class ChangeAssignedToIdNullConstraintOnTasks < ActiveRecord::Migration[8.0]
  def change
    change_column_null :tasks, :assigned_to_id, true
  end
end
