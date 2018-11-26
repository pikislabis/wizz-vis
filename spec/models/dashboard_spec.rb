require 'rails_helper'

RSpec.describe Dashboard, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:widgets) }
    it { is_expected.to have_many(:filters) }
  end
end
