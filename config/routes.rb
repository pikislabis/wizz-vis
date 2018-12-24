# frozen_string_literal: true

Rails.application.routes.draw do
  resources :widgets, except: :index do
    post :data, on: :member
  end

  resources :dashboards do
    resources :widgets, only: :index
    put :layout, to: 'dashboards#update_layout', on: :member
  end

  resources :datasources, only: :show do
    resources :dimensions, param: :name do
      get :values
    end
  end

  draw :api

  root to: 'dashboards#index'
end
