# Hootdoog

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