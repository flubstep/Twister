import sys
import itertools
import argparse
import json

parser = argparse.ArgumentParser(description='Create an anagram build for Text Twist')
parser.add_argument(
  'words',
  metavar='WORD',
  type=str,
  nargs='+',
  help='A string to anagramize'
)
parser.add_argument(
    '--dict',
    dest='dictfile',
    default='/usr/share/dict/words',
    help='Dictionary file'
)
args = parser.parse_args()

words = set(open(args.dictfile).read().split())

if __name__ == '__main__':
    for to_split in args.words:
        output = []
        for wlen in range(3, len(to_split)+1):
            for possible in itertools.permutations(to_split, wlen):
                possible_word = ''.join(possible)
                if possible_word in words:
                    output.append(possible_word.upper())
        obj = {
            'word': to_split.upper(),
            'anagrams': sorted(set(output))
        }
        print(json.dumps(obj, indent=4, separators=(', ', ': ')))