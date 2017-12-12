package TextTemplater;
use strict;
use warnings;
our $VERSION = 1.00;

sub populate
{
  my $template_string = shift(@_);
  my $variables_ref = shift(@_);
  $template_string=~ s/({(.+?)})/exists $variables_ref->{$2} ? $variables_ref->{$2} : $1/ge;
  return $template_string;
}

sub variables
{
  my $template_string = shift(@_);
  my @vars = ( $template_string =~ /{(.+?)}/g );
  return @vars;
}

1;
