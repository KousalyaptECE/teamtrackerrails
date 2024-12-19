Rails.application.routes.draw do
  devise_for :users, controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations'
  }
  get '/projects', to: 'projects#index'
  resources :users
  resources :projects do
    resources :tasks, only: [:index, :create, :update, :destroy, :show] do
      post 'add_label/:label_id', to: 'tasks#add_label', as: 'add_label'
      member do
        patch :resolve
        patch :close
        patch :open
      end
      resources :comments, only: [:create, :update, :destroy,  :index]
    end
  end
  resources :projects do
    member do
      get :members
    end
  end

  resources :tasks do
    collection do
      get 'filter'
    end
  end
  resources :labels, only: [:index, :create, :destroy]


  # Assuming the endpoint is within the Dashboard controller
  get '/projects', to: 'projects#index'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
