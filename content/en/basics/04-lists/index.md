# Lists

Typst supports three kinds of lists: unordered, ordered, and term lists.

## Unordered lists

Start a line with `- ` to create a bullet point:

```typst
- Apples
- Bananas
- Cherries
```

## Ordered lists

Start a line with `+ ` for a numbered list:

```typst
+ Preheat the oven to 200°C
+ Mix the dry ingredients
+ Add the wet ingredients
+ Bake for 25 minutes
```

Typst handles numbering automatically. You don't write the numbers yourself.

## Nested lists

Indent items to nest them. You can mix list types:

```typst
- Fruits
  - Apples
  - Bananas
- Vegetables
  + Wash them
  + Chop them
  + Cook them
```

Use two spaces (or a tab) for each level of indentation.

## Term lists

Term lists are useful for definitions and glossaries. The syntax is `/ term: description`:

```typst
/ Typst: A modern typesetting system.
/ LaTeX: A document preparation system from the 1980s.
/ Markdown: A lightweight markup language for plain text.
```

## Customizing list markers

You can change the bullet symbol for unordered lists using a set rule:

```typst
#set list(marker: "→")

- First item
- Second item
- Third item
```

Or use different markers per level:

```typst
#set list(marker: ([•], [–], [·]))

- Level one
  - Level two
    - Level three
```

## Continuing a numbered list

If you need text between numbered items but want the count to continue, use `#enum`:

```typst
+ First step

Some explanation about the first step.

+ Second step
+ Third step
```

## Try it

```typst
= Shopping List

- Dairy
  - Milk
  - Butter
  - Cheese
- Produce
  - Tomatoes
  - Spinach

= Recipe Steps

+ Gather ingredients
+ Prepare the sauce
+ Cook the pasta
+ Combine and serve

= Glossary

/ Al dente: Pasta cooked so it's still slightly firm when bitten.
/ Mise en place: Everything in its place — ingredients prepped before cooking.
```
