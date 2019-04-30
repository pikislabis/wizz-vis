module ApplicationHelper
  def layout_theme
    action_name == 'show' && @dashboard&.theme
  end

  def nav_logos
    capture do
      concat primary_logo_with_link
      concat secondary_logo
    end
  end

  def primary_logo_with_link(classname = 'brand-logo menu-smooth-scroll')
    link_to root_path, class: classname do
      primary_logo
    end
  end

  def primary_logo(classname = '')
    if ENV['PRIMARY_LOGO_URL'].nil? or ENV['PRIMARY_LOGO_URL'].strip.empty?
      image_tag(asset_path('logo.png'), class: classname)
    else
      image_tag(ENV['PRIMARY_LOGO_URL'], class: classname)
    end
  end

  def secondary_logo
    if ENV['SECONDARY_LOGO_URL']
      content_tag :div, class: 'brand-logo secondary-logo right' do
        image_tag(ENV['SECONDARY_LOGO_URL'])
      end
    end
  end
end
