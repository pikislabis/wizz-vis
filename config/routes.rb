# frozen_string_literal: true

Rails.application.routes.draw do
  resources :widgets, except: :index do
    post :data, on: :member
  end

  resources :dashboards do
    resources :widgets, only: :index
    put :layout, to: 'dashboards#update_layout', on: :member
  end

  resources :datasources, only: [:index, :show] do
    resources :dimensions, param: :name do
      get :values
    end
  end

  draw :api

  root to: 'dashboards#index'

  # Dynamic error pages
  if Rails.env.production?
    %w(400 404 500).each do |code|
      get code, controller: :errors, action: :error, code: code
    end
  end
end
