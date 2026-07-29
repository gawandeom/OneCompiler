/**
 * Kadane's Algorithm to find the maximum subarray sum.
 * @param {number[]} nums - An array of integers.
 * @returns {number} The maximum subarray sum.
 */
function maxSubArraySum(nums) {
    // Handle empty array edge case
    if (nums.length === 0) return 0;

    let maxSoFar = nums[0];
    let currentMax = nums[0];

    for (let i = 1; i < nums.length; i++) {
        // Decide whether to add the current element to the existing subarray 
        // or start a brand new subarray from the current element.
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        
        // Update the global maximum if the current subarray sum is larger.
        maxSoFar = Math.max(maxSoFar, currentMax);
    }

    return maxSoFar;
}

// --- Example Usage ---
const array = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log("Maximum Subarray Sum:", maxSubArraySum(array)); 
// Output: 6 (The subarray is [4, -1, 2, 1])
