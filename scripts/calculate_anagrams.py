import sys
import itertools
import argparse
import json


def anagrams(word, dictionary):
    output = []
    for wlen in range(3, len(word)+1):
        for possible in itertools.permutations(word, wlen):
            possible_word = ''.join(possible)
            if possible_word in dictionary:
                output.append(possible_word.upper())
    obj = {
        'word': word.upper(),
        'anagrams': sorted(set(output))
    }
    return json.dumps(obj, indent=4, separators=(',', ': '))


if __name__ == '__main__':
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

    dictionary = set(open(args.dictfile).read().split())
    for word in args.words:
        print(anagrams(word, dictionary))