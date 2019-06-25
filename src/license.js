const LENGTH = 78;

const TEXT = [
  'VIM LICENSE',
  '',
  {
    indent: '   ',
    prefix: 'I) ',
    text: (project) => `
    There are no restrictions on distributing unmodified copies of ${project} except
    that they must include this license text.  You can also distribute
    unmodified parts of ${project}, likewise unrestricted except that they must
    include this license text.  You are also allowed to include executables
    that you made from the unmodified ${project} sources, plus your own usage
    examples and Vim scripts.
    `
  },
  '',
  {
    indent: '   ',
    prefix: 'II)',
    text: (project) => `
    It is allowed to distribute a modified (or extended) version of ${project},
    including executables and/or source code, when the following four
    conditions are met:
    `
  },
  {
    indent: '      ',
    prefix: '    1)',
    text: (project) => `
    This license text must be included unmodified.
    `
  },
  {
    indent: '      ',
    prefix: '    2)',
    text: (project) => `
    The modified ${project} must be distributed in one of the following five ways:
    `
  },
  {
    indent: '         ',
    prefix: '       a)',
    text: (project) => `
    If you make changes to ${project} yourself, you must clearly describe in
    the distribution how to contact you.  When the maintainer asks you
    (in any way) for a copy of the modified ${project} you distributed, you
    must make your changes, including source code, available to the
    maintainer without fee.  The maintainer reserves the right to
    include your changes in the official version of ${project}.  What the
    maintainer will do with your changes and under what license they
    will be distributed is negotiable.  If there has been no negotiation
    then this license, or a later version, also applies to your changes.
    The current maintainer is Bram Moolenaar <Bram@vim.org>.  If this
    changes it will be announced in appropriate places (most likely
    vim.sf.net, www.vim.org and/or comp.editors). When it is completely
    impossible to contact the maintainer, the obligation to send him
    your changes ceases.  Once the maintainer has confirmed that he has
    received your changes they will not have to be sent again.
    `
  },
  {
    indent: '         ',
    prefix: '       b)',
    text: (project) => `
    If you have received a modified ${project} that was distributed as
    mentioned under a) you are allowed to further distribute it
    unmodified, as mentioned at I).  If you make additional changes the
    text under a) applies to those changes.
    `
  },
  {
    indent: '         ',
    prefix: '       c)',
    text: (project) => `
    Provide all the changes, including source code, with every copy of
    the modified ${project} you distribute.  This may be done in the form of a
    context diff.  You can choose what license to use for new code you
    add.  The changes and their license must not restrict others from
    making their own changes to the official version of ${project}.
    `
  },
  {
    indent: '         ',
    prefix: '       d)',
    text: (project) => `
    When you have a modified ${project} which includes changes as mentioned
    under c), you can distribute it without the source code for the
    changes if the following three conditions are met:
    `
  },
  {
    indent: '           ',
    prefix: '          -',
    text: (project) => `
    The license that applies to the changes permits you to distribute
    the changes to the Vim maintainer without fee or restriction, and
    permits the Vim maintainer to include the changes in the official
    version of ${project} without fee or restriction.
    `
  },
  {
    indent: '           ',
    prefix: '          -',
    text: (project) => `
    You keep the changes for at least three years after last
    distributing the corresponding modified ${project}.  When the maintainer
    or someone who you distributed the modified ${project} to asks you (in
    any way) for the changes within this period, you must make them
    available to him.
    `
  },
  {
    indent: '           ',
    prefix: '          -',
    text: (project) => `
    You clearly describe in the distribution how to contact you.  This
    contact information must remain valid for at least three years
    after last distributing the corresponding modified ${project}, or as long
    as possible.
    `
  },
  {
    indent: '         ',
    prefix: '       e)',
    text: (project) => `
    When the GNU General Public License (GPL) applies to the changes,
    you can distribute the modified ${project} under the GNU GPL version 2 or
    any later version.
    `
  },
  {
    indent: '      ',
    prefix: '    3)',
    text: (project) => `
    A message must be added, at least in the output of the ":version"
    command and in the intro screen, such that the user of the modified ${project}
    is able to see that it was modified.  When distributing as mentioned
    under 2)e) adding the message is only required for as far as this does
    not conflict with the license used for the changes.
    `
  },
  {
    indent: '      ',
    prefix: '    4)',
    text: (project) => `
    The contact information as required under 2)a) and 2)d) must not be
    removed or changed, except that the person himself can make
    corrections.
    `
  },
  '',
  {
    indent: '    ',
    prefix: 'III)',
    text: (project) => `
    If you distribute a modified version of ${project}, you are encouraged to use
    the Vim license for your changes and make them available to the
    maintainer, including the source code.  The preferred way to do this is
    by e-mail or by uploading the files to a server and e-mailing the URL.
    If the number of changes is small (e.g., a modified Makefile) e-mailing a
    context diff will do.  The e-mail address to be used is
    <maintainer@vim.org>
    `
  },
  '',
  {
    indent: '    ',
    prefix: 'IV) ',
    text: (project) => `
    It is not allowed to remove this license from the distribution of the ${project}
    sources, parts of it or from a modified version.  You may use this
    license for previous ${project} releases instead of the license that they came
    with, at your option.
    `
  },
  '',
];

const gen = (project) => TEXT.map(part => {
  if (typeof part === 'string') {
    return part;
  }

  const p = part.text(project).trim();
  const words = p.replace(/\n\s+/g, ' ').split(/\s/g);

  const lines = [part.prefix];
  let row = 0;

  words.forEach(word => {
    if (lines[row].length + word.length + 1 <= LENGTH) {
      lines[row] = `${lines[row]} ${word}`;
    } else {
      row = row + 1;
      lines[row] = `${part.indent} ${word}`;
    }
  });

  return lines.join('\n');
}).join('\n');

export default gen;
