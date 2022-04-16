package ua.edu.ukma.school_simplifier.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Pair<T, V> {

    private T first;
    private V second;
}
