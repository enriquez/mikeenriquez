---
layout: post
title: How to integrate Ultraviolet into Mephisto
---
<p>I couldn&#8217;t find a theme I liked for CodeRay, and I wasn&#8217;t up for creating/modifying my own. I ended up finding a different syntax highlighter called <a href="http://ultraviolet.rubyforge.org">Ultraviolet</a>. It uses TextMate&#8217;s syntax files which is pretty cool. The code in this article is highlighted using the &#8220;lazy&#8221; theme.</p>
<p>Integrating Ultraviolet into Mephisto (or more specifically the filtered_column_code_macro plugin) can be done in 3 steps.</p>
<h3>Step 1: Install Ultraviolet</h3>
<p>I won&#8217;t get into too much detail here. You can follow the directions here: <a href="http://ultraviolet.rubyforge.org/">http://ultraviolet.rubyforge.org/</a>.</p>
<h3>Step 2: Hack filtered_column_code_macro</h3>
<p>I consider this a dirty hack. Ideally, <code>filtered_column_code_macro</code> would be written to give the user options to use either CodeRay or Ultraviolet. Kinda like how <code>filtered_column</code> supports Markdown and Textile. This works for now&#8230;</p>
<p>Modify code_macro.rb to look like the following:</p>
{% highlight ruby %}
# plugins/filtered_column_code_macro/lib/code_macro.rb

require 'uv'

class CodeMacro < FilteredColumn::Macros::Base
  DEFAULT_OPTIONS = {:wrap => :div, :line_numbers => :table, :tab_width => 2, :bold_every => 5, :hint => false, :line_number_start => 1}
  def self.filter(attributes, inner_text = '', text = '')
    # It's a whole lot easier to just set your attributes statically
    # I think for most of us the only option we're gonna change is 'lang'
    # refer to http://rd.cycnus.de/coderay/doc/classes/CodeRay/Encoders/HTML.html for more info
    # use code_highlighter.css to change highlighting
    # don't change, formats code so code_highlighter.css can be used

    lang    = attributes[:lang].blank? ? nil : attributes[:lang].to_sym
    options = DEFAULT_OPTIONS.dup
    # type of line number to print options: :inline, :table, :list, nil [default = :table]
    # you can change the line_numbers default value but you will probably have to change the css too
    options[:line_numbers]      = attributes[:line_numbers].to_sym    unless attributes[:line_numbers].blank?
    # changes tab spacing [default = 2]
    options[:tab_width]         = attributes[:tab_width].to_i         unless attributes[:tab_width].blank?
    # bolds every 'X' line number
    options[:bold_every]        = attributes[:bold_every].to_i        unless attributes[:bold_every].blank?
    # use it if you want to can be :info, :info_long, :debug just debugging info in the tags
    options[:hint]              = attributes[:hint].to_sym            unless attributes[:hint].blank?
    # start with line number
    options[:line_number_start] = attributes[:line_number_start].to_i unless attributes[:line_number_start].blank?

    inner_text = inner_text.gsub(/\A\r?\n/, '').chomp
    html = ""

    begin
      html = Uv.parse(inner_text, "xhtml", lang.to_s, false, "lazy")
    rescue
      unless lang.blank?
        RAILS_DEFAULT_LOGGER.warn "UltraViolet Error: #{$!.message}"
        RAILS_DEFAULT_LOGGER.debug $!.backtrace.join("\n")
      end
      html = "<pre><code>#{CGI.escapeHTML(inner_text)}</code></pre>"
    end
    "<div class=\"ultraviolet\">\n#{html}</div>\n"
  end
end
{% endhighlight %}

<p>Two things to note here:</p>
<ol>
  <li>Don&#8217;t forget to <code>require 'uv'</code> at the top. We won&#8217;t be needing CodeRay here anymore.</li>
  <li>Pay attention to the parameters passed to <code>Uv.parse</code> towards the bottom.</li>
</ol>
<p>If you want to turn on <strong>line numbers</strong>, set the 4th parameter for <code>Uv.parse</code> to true. If you want to use a <strong>different theme</strong>, place it&#8217;s name in the 5th parameter. Again, a dirty hack that should be configured by the user of this library, but this isn&#8217;t an article about best practices.</p>
<h3>Step 3: Generate and include the <span class="caps">CSS</span></h3>
<p>Fire up irb and run the following:</p>
{% highlight bash %}
>> require 'uv'
>> Uv.copy_files "xhtml", "PATH_TO_GENERATE_FILES"
{% endhighlight %}
<p>This will create a css directory containing all of the TextMate themes. Copy the theme you want and include it in your layout.liquid:</p>
{% highlight bash %}
{% raw %}
<!-- layout.liquid -->
{{ 'lazy' | stylesheet : 'screen, projection' }}
{% endraw %}
{% endhighlight %}
<p>That&#8217;s it! Using it works the same way as before by using the <code>&lt;macro:code lang="ruby"&gt;</code> tags. A list of supported languages can be found by running <code>puts Uv.syntaxes.join( ", " )</code> in irb.</p>
