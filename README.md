# Hootdoog

## How to make the app a habit

Based on Atomic Habits, this is how you form the habit.

### 1. Cue - make it obvious

- It has to be constantly on the mind. This is Google, Uber, Kleenex, etc where the brand name is a verb.

### 2. Craving - make it attractive

- It has to be fucking cool.
- Beautiful and distinctive UI.

### 3. Response - make it easy

- We need to minimize time/clicks/friction to getting a reservation or a share.
- Create a "Top Pick" that immediately surfaces the details to the user, and
  provides a means for sharing it immmediately with their peer.
- We need to maximize the obviousness of how to engage.
- big buttons.
- Perhaps having the map UI at the forefront is too much detail, overwhelming the user.

### 4. Reward - make it satisfying

- It has to have a high reservation rate.

## State management flow

We're making a few API calls here once the two places are set.

1. nearbyPlaces
2. distanceMatrix

We need a way to assemble all the information so that the global state is assembled in an easy-to-access way.
Core to this is the information we want to display when a user selects a location.

### List of places information

- name
- reviews
- distance from yours, theirs

### Selected place information

- name
- address
- hours
- distance from yours, theirs
- image of interior
- one-liner
