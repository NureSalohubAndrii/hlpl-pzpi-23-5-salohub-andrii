# Перше завдання
# def smallest(a, b, c):
#     print(min(a, b, c))


def smallest(a, b, c):
    if a < b and b < c:
        print(a)
    elif b < a and a < c:
        print(b)
    else:
        print(c)


smallest(102, 1234, -5)


# Друге завдання
def reverse_word(word):
    return word[::-1]


print(reverse_word("hello"))


# Третє завдання
def is_palindrom(word):
    print(word == reverse_word(word))


is_palindrom("eye")
is_palindrom("0hello0")

# Четверте завдання
nums = [2, 3, 5, 10, -2, 13]


def quick_sort(nums):
    if len(nums) < 1:
        return nums

    less = []
    equal = []
    greater = []

    pivot = nums[len(nums) // 2]

    for num in nums:
        if num < pivot:
            less.append(num)
        elif num == pivot:
            equal.append(num)
        else:
            greater.append(num)

    return quick_sort(less) + equal + quick_sort(greater)


print(quick_sort(nums))
