# ----------------------------------------------------------------------
# config file for SASS/Compass
# http://beta.compass-style.org/help/tutorials/configuration-reference/
# ----------------------------------------------------------------------
http_path       = "/"

sass_dir        = "scss"
css_dir         = "css"
images_dir      = "img"

# toggle between the sass or scss syntax
sass_options = {
  :syntax => :scss
}

line_comments   = false
# build compass for production
# compass compile -e production --force
# other output styles are :nested, :expanded, :compact, or :compressed
# output_style    = (environment == :production) ? :compressed : :expanded
output_style = :compressed

