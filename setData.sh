#!/bin/bash

# Check if an argument is provided
if [[ -z "$1" ]]; then
    echo "Usage: $0 {7|14|30}"
    exit 1
fi

# Set the source directory based on the argument
case "$1" in
    7)
        SOURCE_DIR="WeekData"
        ;;
    14)
        SOURCE_DIR="TwoWeekData"
        ;;
    30)
        SOURCE_DIR="MonthData"
        ;;
    *)
        echo "Invalid argument. Please use 7, 14, or 30."
        exit 1
        ;;
esac

# Check if the source directory exists
if [[ ! -d "DataCollections/$SOURCE_DIR" ]]; then
    echo "Source directory '$SOURCE_DIR' does not exist."
    exit 1
fi

# Check if the target directory exists, if not create it
TARGET_DIR="BudgetMate/server/Data"
if [[ ! -d "$TARGET_DIR" ]]; then
    echo "Target directory '$TARGET_DIR' does not exist, creating it."
    mkdir -p "$TARGET_DIR"
fi

# Copy files from source to target directory, replacing existing files
cp -r "DataCollections/$SOURCE_DIR"/* "$TARGET_DIR"/

echo "Files from '$SOURCE_DIR' have replaced files in '$TARGET_DIR'."
