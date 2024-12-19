class Project < ApplicationRecord
  belongs_to :user
  has_many :project_members
  has_many :members, through: :project_members, source: :user
  has_many :tasks
  accepts_nested_attributes_for :members, allow_destroy: true

  
end
