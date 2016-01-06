import sys
import argparse
import random
from calculate_anagrams import anagrams

if __name__ == '__main__':

    parser = argparse.ArgumentParser(description='Find a random word from the word list with 6 letters')
    parser.add_argument(
      'count',
      metavar='COUNT',
      type=int,
      default=1,
      help='A string to anagramize'
    )
    parser.add_argument(
        '--dict',
        dest='dictfile',
        default='/usr/share/dict/words',
        help='Dictionary file'
    )
    args = parser.parse_args()

    words = open(args.dictfile).read().split()
    words_set = set(words)
    words_sixes = [w for w in words if len(w) == 6]

    for idx in range(args.count):
        word_six = random.choice(words_sixes)
        with open('anagrams.%d.json' % (idx+1), 'w') as fp:
            fp.write(anagrams(word_six, words_set))