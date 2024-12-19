class Task < ApplicationRecord
  belongs_to :project
  belongs_to :assigned_to, class_name: "User", optional: true
  belongs_to :creator, class_name: "User", foreign_key: "created_by", optional: true
  has_and_belongs_to_many :labels
  validates :title, presence: true
  validates :estimated_time, presence: true
  has_many :comments, dependent: :destroy

  validates :state, inclusion: { in: %w[opened resolved closed], message: "is not a valid state" }

  def resolve!
    update!(state: 'resolved')
  end

  def close!
    update!(state: 'closed')
  end

  def open!
    update!(state: 'opened')
  end
end
